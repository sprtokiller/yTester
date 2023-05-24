import { Model, Column, Table, PrimaryKey, AllowNull, IsUUID, BelongsToMany, HasMany } from "sequelize-typescript";
import { Tester } from "./Tester";
import { AnonymousTester } from "./AnonymousTester";
import { TesterGroup } from "./TesterGroup";

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

  @HasMany(() => AnonymousTester)
  anonymousTesters?: AnonymousTester[];
}