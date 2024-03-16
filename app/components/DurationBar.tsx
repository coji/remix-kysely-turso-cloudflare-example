import { Badge, HStack } from '~/components/ui'

interface DurationBarProps extends React.HTMLAttributes<'div'> {
  loader: number
  action?: number
}
export const DurationBar = ({ loader, action }: DurationBarProps) => {
  return (
    <HStack className="items-center gap-4">
      <HStack>
        <div>SELECT</div> <Badge variant="default">{loader}ms</Badge>
      </HStack>
      {action && (
        <HStack>
          <div>INSERT / UPDATE</div>
          <Badge variant="destructive">{action}ms</Badge>
        </HStack>
      )}
    </HStack>
  )
}
