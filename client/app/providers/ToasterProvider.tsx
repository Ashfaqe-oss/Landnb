"use client";

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return <Toaster position="top-center" />;
};

export default ToasterProvider;
//we do this because

//hot-toast is a client based external lib that needs at least one client enabled parent component to work with next server components