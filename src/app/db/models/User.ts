import { Model, Column, Table, PrimaryKey, AllowNull, HasMany } from "sequelize-typescript";
import { Course } from "./Course";
import { Tester } from "./Tester";
import { Group } from "./Group";

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

  @HasMany(() => Tester)
  testers!: Tester[];

  @HasMany(() => Group)
  groups!: Group[];
}