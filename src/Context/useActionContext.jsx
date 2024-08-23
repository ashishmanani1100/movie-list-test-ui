import { useContext } from "react";

import { ActionContext } from "./ContextProvider";

const useActionContext = () => {
  const value = useContext(ActionContext);

  return value;
};

export default useActionContext;
