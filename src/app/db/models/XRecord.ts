import { Model, Column, Table, PrimaryKey, AllowNull, IsUUID, ForeignKey, BelongsTo } from "sequelize-typescript";
import { XVerb } from "./XVerb";
import { XObject } from "./XObject";
import { Test } from "./Test";

@Table
export class XRecord extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  recordUUID!: string;

  @AllowNull(false)
  @Column
  testerUUID!: string;

  @ForeignKey(() => XVerb)
  @Column
  verbID!: string;

  @BelongsTo(() => XVerb)
  verb!: XVerb;

  @ForeignKey(() => XObject)
  @Column
  objectID!: string;

  @BelongsTo(() => XObject)
  object!: XObject;

  @ForeignKey(() => Test)
  @Column
  testUUID!: string;

  @BelongsTo(() => Test)
  test!: Test;

  /* result */

  @Column
  success?: boolean;

  @Column
  completion?: boolean;

  @Column
  duration?: string; //ISO_8601

  @Column
  response?: string;

  @Column
  scoreScaled?: number;

  @Column
  scoreRaw?: number;

  @Column
  scoreMin?: number;

  @Column
  scoreMax?: number;

  @Column
  timestamp!: Date;
}