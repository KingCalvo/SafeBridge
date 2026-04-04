import { useEffect } from "react";

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = `SafeBridge - ${title}`;
  }, [title]);

  return null;
};

export default PageTitle;
