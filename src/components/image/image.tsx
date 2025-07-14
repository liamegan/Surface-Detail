import { ImageItem } from "./ImageItem";

export const image = ({
  value,
}: {
  value: { asset: { _ref: string }; alt: string };
}) => {
  return <ImageItem value={value} />;
};
