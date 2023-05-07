import { Model, Column, Table, BelongsTo, ForeignKey, PrimaryKey, AllowNull, IsUUID, HasMany, IsIn, DataType } from "sequelize-typescript";
import { ContentType } from "../../utils";
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
  courseLocation!: string;

  @IsIn([Object.values(ContentType)])
  @Column({
    type: DataType.ENUM(...Object.values(ContentType)),
    defaultValue: ContentType.OTHER,
    allowNull: false
  })
  contentType!: ContentType;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  sub!: string;

  @BelongsTo(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user!: User;

  @HasMany(() => Test)
  tests!: Test[];
}