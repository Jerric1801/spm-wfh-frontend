import { cn } from '../../utils/tailwindUtils';

function Tag({ text = "Text", color = "blue", reverse = false }) { 
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center tag', 
        color === 'blue' && (reverse ? 'bg-tag-blue-dark text-tag-blue-light' : 'bg-tag-blue-light text-tag-blue-dark'),
        color === 'red' && (reverse ? 'bg-tag-red-dark text-tag-red-light' : 'bg-tag-red-light text-tag-red-dark'),
        color === 'green' && (reverse ? 'bg-tag-green-dark text-tag-green-light' : 'bg-tag-green-light text-tag-green-dark'),
        color === 'grey' && (reverse ? 'bg-tag-grey-dark text-tag-grey-light' : 'bg-tag-grey-light text-tag-grey-dark'),
        color === 'orange' && (reverse ? 'bg-tag-orange-dark text-tag-orange-light' : 'bg-tag-orange-light text-tag-orange-dark'),
        'rounded-[5px] font-bold text-xs p-1'
      )}
    >
      {text}
    </div>
  );
}

export default Tag;