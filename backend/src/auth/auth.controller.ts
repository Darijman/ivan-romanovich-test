import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './registerUser.dto';
import { Public } from './auth.decorator';
import { LoginUserDto } from './loginUser.dto';
import { Response, Request } from 'express';
import { UserDuplicateEmailFilter } from 'src/common/filters/user-duplicate-email.filter';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@UseFilters(UserDuplicateEmailFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @Public()
  @HttpCode(201)
  @Post('register')
  async registerNewUser(@Body() registerUserDto: RegisterUserDto, @Res() res: Response) {
    const { access_token } = await this.authService.registerNewUser(registerUserDto);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    });

    return res.send({ success: true });
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  async logInUser(@Body() logInUserDto: LoginUserDto, @Res() res: Response) {
    const { access_token } = await this.authService.logIn(logInUserDto);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    });

    return res.send({ success: true });
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const { id } = req.user;
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['role'] });
    if (!user) {
      throw new BadRequestException({ error: 'User not found!' });
    }

    return { id: user.id, name: user.name, email: user.email, roleName: user.role.name };
  }

  @Public()
  @HttpCode(200)
  @Post('logout')
  async logOutUser(@Res() res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return res.send({ success: true });
  }
}
