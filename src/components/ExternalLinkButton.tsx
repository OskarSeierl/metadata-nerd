import {ReactNode} from "react";

interface ExternalLinkButtonProps {
  children?: ReactNode;
  url: string;
}

export function ExternalLinkButton({children, url}: ExternalLinkButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary hover:underline underline-offset-4"
    >
      {children}
    </a>
  )
}
