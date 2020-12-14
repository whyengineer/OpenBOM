import {EntitySchema} from "typeorm";

 export const BomDiode = new EntitySchema({
    name: "diode",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: "increment"
        },
        pn: {
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
        desc: {
            type: String,
            nullable: false
        },
        type: {
            type: String,
            nullable: false
        },
        datasheet: {
            type: String,
            nullable: true
        },
        symbol: {
            type: String,
            nullable: true
        },
        library_ref:{
            type: String,
            nullable: true
        },
        library_path:{
            type: String,
            nullable: true
        },
        footprint_path:{
            type: String,
            nullable: true
        },
        vendor1: {
            type: String,
            nullable: false
        },
        vendor1_pn: {
            type: String,
            nullable: false
        },
        vendor2: {
            type: String,
            nullable: true
        },
        vendor2_pn: {
            type: String,
            nullable: true
        },
    },
    indices: [
        {
            name: "value",
            unique: false,
            columns: [
                "value",
            ]
        },
        {
            name: "footprint",
            unique: false,
            columns: [
                "footprint",
            ]
        },
        {
            name: "pn",
            unique: true,
            columns: [
                "pn",
            ]
        },
        {
            name: "type",
            unique: false,
            columns: [
                "type",
            ]
        },
    ],
});