import * as crypto from 'crypto';
import {
    AutoIncrement,
    BeforeCreate,
    BeforeValidate,
    Column,
    CreatedAt,
    DataType,
    DefaultScope,
    DeletedAt,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from 'sequelize-typescript';
import { IDefineOptions } from 'sequelize-typescript/lib/interfaces/IDefineOptions';


const tableOptions: IDefineOptions = {
    timestamp: true;
    tableName: "users";
} as IDefineOptions;

@DefaultScope({
    include: [()=>Entry]
})
@Table(tableOptions)
export class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    public id:number;

    @Column({type: DataType.STRING, allowNull: false})
    public firstName: string;

    @Column({type: DataType.STRING, allowNull: false})
    public lastName: string;

    @Column({
        type:DataType.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
            isUnique: async (value: string, next: any): Promise<any> => {
                let isExist = await User.findOne({where: {email: value}});
                if(isExist){
                    let error = new Error("The email is already used.");
                    next(error);
                }
                next();
            }
        }
    })
    public email: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    public password: string;

    @CreatedAt public createdAt: Date;
    @UpdatedAt public updatedAt: Date;
    @DeletedAt public deletedAt: Date;

    @HasMany(() => Entry)
    public entires: Entry[];

    @HasMany(() => Comment)
    public comments: Comment[];

    @BeforeValidate
    public static validateData(user: User, options: any){
        if(!options.transaction) throw new Error("Missing transaction");
    }

    @BeforeCreate
    public static async hashPassword(user: User, options: any){
        if(!options.transaction) throw new Error("Missing transaction.");

        user.password = crypto.createHmac("sha256", user.password).digest("hex");
    }
}
