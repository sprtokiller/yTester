import { Model, Column, Table, PrimaryKey, AllowNull, IsUUID, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Test } from "./Test";

@Table
export class AnonymousTester extends Model {

  @PrimaryKey
  @AllowNull(false)
  @IsUUID(4)
  @Column
  anonymousTesterUUID!: string;

  @ForeignKey(() => Test)
  @AllowNull(false)
  @Column
  testUUID!: string;

  @BelongsTo(() => Test, { onDelete: 'CASCADE' })
  test!: Test;
}