import React from "react";
import { render } from 'react-dom';
import { ChakraProvider } from "@chakra-ui/react";

import Header from "./components/Header";
import Todos from "./components/Todos";
import Calendar from "./components/Calendar"

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


function App() {
  return (
    <Tabs>
      <TabList>
        <Tab>Todo</Tab>
        <Tab>Calendar</Tab>
      </TabList>

      <TabPanel>
        <ChakraProvider>
          <Header title="List"/>
          <Todos />
        </ChakraProvider>
      </TabPanel>
      <TabPanel>
        <ChakraProvider>
          <Header title="Schedule" />
          <Calendar />
        </ChakraProvider>
      </TabPanel>
    </Tabs>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)