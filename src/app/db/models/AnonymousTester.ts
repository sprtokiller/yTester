import { Model, Column, Table, PrimaryKey, AllowNull, IsUUID, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Group } from "./Group";

@Table
export class AnonymousTester extends Model {

  @PrimaryKey
  @AllowNull(false)
  @IsUUID(4)
  @Column
  testerUUID!: string;

  @ForeignKey(() => Group)
  @AllowNull(false)
  @Column
  groupUUID!: string;

  @BelongsTo(() => Group)
  group!: Group;
}