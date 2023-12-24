import { Welcome } from "@/components/Welcome/Welcome";
import { Text, Space, rem, Paper, Stepper, Center, List, ThemeIcon } from "@mantine/core";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { TbProgressBolt } from "react-icons/tb";
import { IoCheckmarkOutline } from "react-icons/io5";
import { IconCircleCheck, IconCircleDashed } from "@tabler/icons-react";
import { Fade } from 'react-awesome-reveal';
import { HowItWorks } from "@/components/HowItWorks/HowItWorks";
import classes from "../pagestyles/MilestoneStepper.module.css";
export default function Why() {

return(
    <>
    <Space h={111}/>

    <Welcome />

    <HowItWorks/>

    <Space h={111} />

</>
)
}