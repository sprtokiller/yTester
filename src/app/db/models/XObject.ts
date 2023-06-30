import { Model, Column, Table, PrimaryKey, AllowNull, HasMany } from "sequelize-typescript";
import { XRecord } from './XRecord'

@Table
export class XObject extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column
  objectID!: string;

  @AllowNull(false)
  @Column
  objectType!: string;

  @AllowNull(false)
  @Column
  name!: string;

  @HasMany(() => XRecord)
  xrecords?: XRecord[];
}