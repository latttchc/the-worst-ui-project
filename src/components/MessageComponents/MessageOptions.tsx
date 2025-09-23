import Button from "@/components/atom/button";
import Text from "@/components/atom/text";

interface MessageOptionsProps {
  options: string[];
  onOptionSelect: (option: string) => void;
  disabled?: boolean;
}

export const MessageOptions = ({
  options,
  onOptionSelect,
  disabled,
}: MessageOptionsProps) => {
  return (
    <div className="mt-6 space-y-2">
      <Text variant="small" className="text-gray-400 mb-2">
        返信を選択してください:
      </Text>
      <div className="flex gap-10">
        {options.map((option, index) => (
          <Button
            key={index}
            variant="secondary"
            size="sm"
            className="w-full text-center bg-[#4f545c] hover:bg-[#5865f2] text-white border-none max-xl:h-full"
            onClick={() => onOptionSelect(option)}
            disabled={disabled}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};
