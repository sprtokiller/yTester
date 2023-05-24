import { Model, Column, Table, PrimaryKey, AllowNull, IsUUID, BelongsToMany } from "sequelize-typescript";
import { Group } from "./Group";
import { TesterGroup } from "./TesterGroup";

@Table
export class Tester extends Model {

  @PrimaryKey
  @AllowNull(false)
  @IsUUID(4)
  @Column
  testerUUID!: string;

  @Column
  firstname?: string;

  @Column
  lastname?: string;

  @Column
  email?: string;

  @BelongsToMany(() => Group, () => TesterGroup)
  groups?: Group[];
}