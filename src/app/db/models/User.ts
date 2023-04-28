import { Model, Column, Table, PrimaryKey, AllowNull, HasMany } from "sequelize-typescript";
import { Course } from "./Course";

@Table
export class User extends Model {

  @PrimaryKey
  @AllowNull(false)
  @Column
  sub!: string;

  @AllowNull(false)
  @Column
  email!: string;

  @HasMany(() => Course)
  courses!: Course[];
}