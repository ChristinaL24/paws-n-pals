insert into "users" ("userId", "username", "password", "joinedAt")
values (1, 'guest', '$argon2i$v=19$m=4096,t=3,p=1$h7icQD/xZr8akZsX+hNA0A$h68atJWyjvunAwNOpSpMfg9sPvoMQ6dKwoh0dJhurWA', NOW());

--Temporary user until log in/sign ups are made
