import {
    Button,
    ChakraProvider,
    Container,
    Heading,
    Image,
    Input,
    SkeletonCircle,
    SkeletonText, Stack,
    Wrap
} from '@chakra-ui/react'
import {useState} from "react";
import axios from "axios";

const App = () => {
    const [image, setImage] = useState();
    const [userInput, setUserInput] = useState()
    const [isLoading, setLoading] = useState()
    console.log(image)

    const generateImage = async (prompt) => {
        setLoading(true)
        const result = await axios.get(`http://127.0.0.1:8000/?prompt=${prompt}`)
        setImage(result.data)
        setLoading(false)
    }

    return (
        <ChakraProvider>
            <Container>
                <Heading marginBottom={4}>Stable Diffusion React 🚀</Heading>

                <Wrap marginBottom={5}>
                    <Input
                        value={userInput}
                        marginBottom={10}
                        onChange={e => setUserInput(e.target.value)}></Input>
                    <Button
                        marginTop={5}
                        onClick={e => generateImage(userInput)}
                        colorScheme={"yellow"}>
                        Generate
                    </Button

>               </Wrap>

                {isLoading ?
                    <Stack>
                        <SkeletonCircle />
                        <SkeletonText />
                    </Stack> : image ?
                    <Image
                        boxShadow={'lg'}
                        src={`data:image/png;base64,${image}`}/>: null
                }
            </Container>
        </ChakraProvider>
    )

}

export default App;