import {EntitySchema} from "typeorm";

 export const Res = new EntitySchema({
    name: "res",
    columns: {
        pn: {
            primary: true,
            type: String,
            nullable: false
        },
        value: {
            type: String,
            nullable: false
        },
        footprint: {
            type: String,
            nullable: false
        },
        jlcpn: {
            type: String,
            nullable: false
        },
        jlcurl: {
            type: String,
            nullable: false
        },
        prices: {
            type: String,
            nullable: true
        },
        imgs: {
            type: String,
            nullable: true
        },
        datasheet: {
            type: String,
            nullable: true
        },
        desc: {
            type: String,
            nullable: false
        },
        svgs: {
            type: String,
            nullable: true
        },
        type_: {
            type: String,
            nullable: true
        },
    },
    indices: [
        {
            name: "res_value",
            unique: false,
            columns: [
                "value",
            ]
        },
        {
            name: "res_footprint",
            unique: false,
            columns: [
                "footprint",
            ]
        },
        {
            name: "res_jlcpn",
            unique: true,
            columns: [
                "jlcpn",
            ]
        },
        {
            name: "res_jlcurl",
            unique: true,
            columns: [
                "jlcurl",
            ]
        },
        {
            name: "res_type_",
            unique: false,
            columns: [
                "type_",
            ]
        },
    ],
});