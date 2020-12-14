import {EntitySchema} from "typeorm";

 export const Connector = new EntitySchema({
    name: "connector",
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
            name: "connector_value",
            unique: false,
            columns: [
                "value",
            ]
        },
        {
            name: "connector_footprint",
            unique: false,
            columns: [
                "footprint",
            ]
        },
        {
            name: "connector_jlcpn",
            unique: true,
            columns: [
                "jlcpn",
            ]
        },
        {
            name: "connector_jlcurl",
            unique: true,
            columns: [
                "jlcurl",
            ]
        },
        {
            name: "connector_type_",
            unique: false,
            columns: [
                "type_",
            ]
        },
    ],
});