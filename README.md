## Tech Stacks
<p>
  <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">
  <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=Prisma&logoColor=white">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
  <img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white">
  <img src="https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white">
</p>

## API
- 회원가입 API
- 로그인 API
- 토큰 재발급 API
- 로그아웃 API

### 로그인 구현 과정

Access Token과 Refresh Token을 사용한 로그인을 구현한다.
![login-process](/resources/login-process.png)

### Refresh Token을 RDB가 아닌 Redis에 저장 이유
- Redis에 데이터를 저장할 때 TTL 값을 설정할 수 있다. 따라서 만료된 refresh token을 수동으로 정리할 필요가 없다. (RDB의 경우 만료 처리를 위한 스케줄링 필요)
- In-Memory DB라 데이터에 빠르게 엑세스 및 응답이 가능하다.

### Redis를 활용한 JWT BlackList 구현
로그아웃 시 클라이언트에서 단순히 엑세스 토큰을 제거할 수 있는데 만일 해당 토큰이 만료되기 전에 탈취해 사용할 수 있기 때문에 로그아웃한 토큰을 BlackList로 저장해 만료시키는 기능을 구현한다.<br/>
엑세스 토큰을 사용해 인증을 진행하는 API 사용할 경우, 토큰 검증 시 해당 토큰이 BlackList에 있는지 확인하는 로직을 추가한다.

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  // 토큰 유효성 검사 및 payload 반환
  async validate(req: any, payload: TokenPayloadDto): Promise<TokenPayloadDto> {
    const token = req.token;

    // blacklist 확인
    if (await this.cacheService.sismember(JWT_BLACKLIST_KEY, token)) {
      throw new UnauthorizedException(ErrMessage.INVALID_TOKEN);
    }

    return payload;
  }
}
```

## Running the app
### Make .env file
```
MYSQL_USER=
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=

DATABASE_URL=

JWT_SECRET=
ACCESS_TOKEN_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=
REDIS_HOST=
REDIS_PORT=
```
### Start with docker compose
```
$ docker compose up -d
```
### Swagger
```
http://localhost:30000/api
```

## Swagger
![swagger](/resources/swagger.png)