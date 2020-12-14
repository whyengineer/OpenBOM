import {EntitySchema} from "typeorm";

 export const Diode = new EntitySchema({
    name: "diode",
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
            name: "diode_value",
            unique: false,
            columns: [
                "value",
            ]
        },
        {
            name: "diode_footprint",
            unique: false,
            columns: [
                "footprint",
            ]
        },
        {
            name: "diode_jlcpn",
            unique: true,
            columns: [
                "jlcpn",
            ]
        },
        {
            name: "diode_jlcurl",
            unique: true,
            columns: [
                "jlcurl",
            ]
        },
        {
            name: "diode_type_",
            unique: false,
            columns: [
                "type_",
            ]
        },
    ],
});