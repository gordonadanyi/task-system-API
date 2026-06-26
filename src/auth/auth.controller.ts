import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import { RefreshTokenDto } from './dto/refreh-token.dto';
import { AuthService } from './auth.service';
import { ApiTags, ApiResponse,ApiOkResponse, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  @ApiCreatedResponse({ 
    description: 'User registered successfully',
    type: CreateUserDto,
    isArray: true
   })
   @ApiBadRequestResponse({
    description: 'Invalid input',
   })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login User' })
  @ApiOkResponse({ description: 'User login sucessful',
    type: LoginDto,
    isArray: true
   })
   @ApiBadRequestResponse({
    description: 'Invalid input',
   })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

    //REFRESHTOKEN
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'get refresh token' })
@Post('refreshtoken')
async refreshtoken(
  @Body() 
  refreshTokenDto: RefreshTokenDto
){
  return this.authService.refreshTokens(refreshTokenDto.token)
}
}
