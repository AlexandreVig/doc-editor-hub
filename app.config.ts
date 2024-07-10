export default defineAppConfig({
  ui: {
    primary: 'carmine',
    gray: 'neutral',
    input: {
      color: {
        primary: {
          outline: 'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-700 dark:focus:ring-primary-400 focus:shadow-3xl focus:shadow-primary-700',
        },
        red: {
          outline: 'shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-primary-700 dark:ring-gray-700 focus:ring-2 focus:ring-primary-700 dark:focus:ring-primary-400 focus:shadow-3xl focus:shadow-primary-700',
        },
      },
      default: {
        size: 'sm',
        color: 'primary',
        variant: 'outline',
      },
    },
    button: {
      color: {
        primary: {
          solid: 'focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-base gap-x-2.5 px-3.5 py-2.5 shadow-sm text-white dark:text-gray-900 bg-primary-700 hover:bg-primary-800 disabled:text-slate-400 disabled:bg-slate-200 dark:bg-primary-400 dark:hover:bg-primary-500 dark:disabled:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 dark:focus-visible:outline-primary-400 inline-flex items-center',
          link: 'focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-base gap-x-2.5 px-3.5 py-2.5 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 inline-flex items-center flex justify-center w-16 h-16 text-3xl rounded-none'
        }
      }
    },
    tooltip: {
      background: 'bg-slate-800',
      color: 'text-white',
      ring: 'ring-1 ring-slate-800',
      base: '[@media(pointer:coarse)]:hidden h-auto px-2 py-1 text-md font-normal truncate relative',
      arrow: {
        background: 'before:bg-slate-800',
      },
    }
  },
})