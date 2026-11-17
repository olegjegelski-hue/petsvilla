import { hayBankLinkHelp } from '@/lib/site-contact'

export function HayBankLinkHelp() {
  const help = hayBankLinkHelp()
  return (
    <p className="text-sm text-gray-600 mt-4 text-center max-w-md mx-auto">
      {help.prefix}{' '}
      <a href={help.mailto} className="text-orange-600 hover:underline">
        {help.email}
      </a>
    </p>
  )
}
