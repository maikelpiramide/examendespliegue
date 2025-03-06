create database pics;
use pics;

create table usuario (
    email varchar(255) not null,
    password VARCHAR(255) not null,
    saldo DECIMAL(4,2) default "00.00",
    PRIMARY KEY(email)
);

create table transaccion(
    id int AUTO_INCREMENT,
    email_usuario varchar(255) not null,
    email_conserje varchar(255) not null,
    concepto varchar(255) not null,
    importe DECIMAL(4,2) not null,
    fecha TIMESTAMP default now(),
    PRIMARY KEY(id),
    Foreign Key (email_usuario) REFERENCES usuario(email),
    Foreign Key (email_conserje) REFERENCES usuario(email)
)
