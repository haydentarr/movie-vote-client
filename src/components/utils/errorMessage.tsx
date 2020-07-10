import * as React from "react";

const ErrorMessageContainer: React.FC<{ errorMessage: string | null }> = ({
  errorMessage
}) => {
  return <p>{errorMessage}</p>; // Replace with error component
};
export default ErrorMessageContainer;