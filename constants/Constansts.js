import { Dimensions } from "react-native";

const { height, width } = Dimensions.get('window')

const ITEM_HEIGHT = 120;
const TAGBAR_HEIGHT = 90;
const CUSTOM_BUTTON_WIDTH = 0.80;
const CUSTOM_BUTTON_HEIGHT = 0.075;
const INPUT_WIDTH = 0.80;
const MODAL_WIDTH = 0.25;
const MODAL_HEIGHT = 0.065;
const LOGIN_HEIGHT = 0.25;
const LOGIN_WIDTH = 0.60;
const REGISTER_HEIGHT = 0.25;
const REGISTER_WIDTH = 0.60;
const DRAWER_ICON = 26;
const DRAWER_ICON_COLOR = "#000000";
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const BACKEND_URL = "http://192.168.0.17:8000"
const WIDTH = width
const HEIGHT = height

export const constants = { ITEM_HEIGHT, TAGBAR_HEIGHT, LOGIN_HEIGHT, LOGIN_WIDTH, BACKEND_URL, EMAIL_REGEX, REGISTER_HEIGHT, REGISTER_WIDTH, MODAL_HEIGHT, MODAL_WIDTH, INPUT_WIDTH, DRAWER_ICON, DRAWER_ICON_COLOR, CUSTOM_BUTTON_HEIGHT, CUSTOM_BUTTON_WIDTH, WIDTH, HEIGHT }