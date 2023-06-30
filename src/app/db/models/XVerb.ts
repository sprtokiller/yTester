import { Model, Column, Table, PrimaryKey, AllowNull, HasMany } from "sequelize-typescript";
import { XRecord } from "./XRecord";
@Table
export class XVerb extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column
  verbID!: string;

  @AllowNull(false)
  @Column
  display!: string;

  @HasMany(() => XRecord)
  xrecords?: XRecord[];
}