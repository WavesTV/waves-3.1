import { Welcome } from "@/components/Welcome/Welcome";
import {Space} from "@mantine/core";
import { HowItWorks } from "@/components/HowItWorks/HowItWorks";

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