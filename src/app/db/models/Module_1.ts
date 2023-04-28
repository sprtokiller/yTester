/* IO Test */

import { Model, Column, Table, BelongsTo, ForeignKey, PrimaryKey, AllowNull, IsUUID } from "sequelize-typescript";
import { Test } from "./Test";

@Table
export class Module_1 extends Model {

  @IsUUID(4)
  @PrimaryKey
  @Column
  moduleUUID!: string;

  @ForeignKey(() => Test)
  @AllowNull(false)
  @Column
  testUUID!: string;

  @BelongsTo(() => Test)
  test!: Test;
}