import { Model, Column, Table, BelongsTo, ForeignKey, PrimaryKey, AllowNull, IsUUID, HasMany } from "sequelize-typescript";
import { User } from "./User";
import { Test } from "./Test";

// @Scopes(() => ({
//   movies: {
//     include: [
//       {
//         model: Movie,
//         through: {attributes: []},
//       },
//     ],
//   },
// }))
@Table
export class Course extends Model {

  @PrimaryKey
  @AllowNull(false)
  @IsUUID(4)
  @Column
  courseUUID!: string;

  @Column
  name!: string;

  @Column
  author!: string;

  @Column
  version!: number;

  @Column
  groupHash!: string;

  @Column
  courseHash!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  sub!: string;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => Test)
  tests!: Test[];
}