import Sequelize from 'sequelize';
const Model = Sequelize.Model;

export class User extends Model { }

export function initUser(sequelize) {
    User.init({
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        name: Sequelize.STRING,
        email: Sequelize.STRING
    }, {
            sequelize,
            modelName: 'user'
        });
}