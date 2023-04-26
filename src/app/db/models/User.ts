import {Model, Column, Table, PrimaryKey, AllowNull} from "sequelize-typescript";

@Table
export class User extends Model {

  @PrimaryKey
  @AllowNull(false)
  @Column
  sub!: string;

  @AllowNull(false)
  @Column
  email!: string;
  
}