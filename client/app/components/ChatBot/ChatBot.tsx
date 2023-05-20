import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const ChatBot = () => {
  return (
    <div className="flex justify-center rounded-xl">
      <Accordion
        type="single"
        collapsible
        className="relative z-40 shadow rounded-xl"
      >
        <AccordionItem value="item-1">
          <div className="fixed right-8 w-60 sm:w-80 hover:shadow-md xl:w-96 bottom-8 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="w-full h-full flex flex-col">
              <AccordionTrigger className="no-underline rounded-xl px-6 border-b-2 shadow-md border-red-400 ">
                <ChatHeader />
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col h-80">
                  <ChatMessages
                   className='px-2 py-3 flex-1'
                  />
                  <ChatInput
                  className='px-4'
                  />
                </div>
              </AccordionContent>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ChatBot;
