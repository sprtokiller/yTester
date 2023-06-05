import { Model, Column, Table, PrimaryKey, AllowNull, IsUUID, BelongsToMany, HasMany, ForeignKey } from "sequelize-typescript";
import { Tester } from "./Tester";
import { AnonymousTester } from "./AnonymousTester";
import { TesterGroup } from "./TesterGroup";
import { User } from "./User";

@Table
export class Group extends Model {

  @PrimaryKey
  @AllowNull(false)
  @IsUUID(4)
  @Column
  groupUUID!: string;

  @AllowNull(false)
  @Column
  groupName!: string;

  @BelongsToMany(() => Tester, () => TesterGroup)
  testers?: Tester[];

  @ForeignKey(() => User)
  @Column
  sub!: string;
}