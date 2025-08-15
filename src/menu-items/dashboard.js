// assets
import {
    IconList,
    IconUsersGroup,
    IconHierarchy,
    IconBuildingStore,
    IconKey,
    IconTool,
    IconLock,
    IconRobot,
    IconSettings,
    IconVariable,
    IconFiles,
    IconTestPipe,
    IconMicroscope,
    IconDatabase,
    IconChartHistogram,
    IconUserEdit,
    IconFileUpload,
    IconClipboardList,
    IconStack2,
    IconUsers,
    IconLockCheck,
    IconFileDatabase,
    IconShieldLock,
    IconListCheck
} from '@tabler/icons-react'

// constant
const icons = {
    IconHierarchy,
    IconUsersGroup,
    IconBuildingStore,
    IconList,
    IconKey,
    IconTool,
    IconLock,
    IconRobot,
    IconSettings,
    IconVariable,
    IconFiles,
    IconTestPipe,
    IconMicroscope,
    IconDatabase,
    IconUserEdit,
    IconChartHistogram,
    IconFileUpload,
    IconClipboardList,
    IconStack2,
    IconUsers,
    IconLockCheck,
    IconFileDatabase,
    IconShieldLock,
    IconListCheck
}

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: '',
    type: 'group',
    children: [
        {
            id: 'primary',
            title: '',
            type: 'group',
            children: [
                {
                    id: 'chatflows',
                    title: 'ایجنت نویسی',
                    type: 'item',
                    url: '/chatflows',
                    icon: icons.IconHierarchy,
                    breadcrumbs: true,
                    permission: 'chatflows:view'
                },
                {
                    id: 'agentflows',
                    title: 'مولتی ایجنت',
                    type: 'item',
                    url: '/agentflows',
                    icon: icons.IconUsersGroup,
                    breadcrumbs: true,
                    permission: 'agentflows:view'
                },
                {
                    id: 'executions',
                    title: 'نشست ها',
                    type: 'item',
                    url: '/executions',
                    icon: icons.IconListCheck,
                    breadcrumbs: true,
                    permission: 'executions:view'
                },
                // {
                //     id: 'assistants',
                //     title: 'دستیارها',
                //     type: 'item',
                //     url: '/assistants',
                //     icon: icons.IconRobot,
                //     breadcrumbs: true,
                //     permission: 'assistants:view'
                // },
                // {
                //     id: 'marketplaces',
                //     title: 'بازارها',
                //     type: 'item',
                //     url: '/marketplaces',
                //     icon: icons.IconBuildingStore,
                //     breadcrumbs: true,
                //     permission: 'templates:marketplace,templates:custom'
                // },
                // {
                //     id: 'tools',
                //     title: 'ابزارها',
                //     type: 'item',
                //     url: '/tools',
                //     icon: icons.IconTool,
                //     breadcrumbs: true,
                //     permission: 'tools:view'
                // },
                // {
                //     id: 'credentials',
                //     title: 'اطلاعات ورود',
                //     type: 'item',
                //     url: '/credentials',
                //     icon: icons.IconLock,
                //     breadcrumbs: true,
                //     permission: 'credentials:view'
                // },
                // {
                //     id: 'variables',
                //     title: 'متغیرها',
                //     type: 'item',
                //     url: '/variables',
                //     icon: icons.IconVariable,
                //     breadcrumbs: true,
                //     permission: 'variables:view'
                // },
                // {
                //     id: 'apikey',
                //     title: 'کلیدهای API',
                //     type: 'item',
                //     url: '/apikey',
                //     icon: icons.IconKey,
                //     breadcrumbs: true,
                //     permission: 'apikeys:view'
                // },
                // {
                //     id: 'document-stores',
                //     title: 'مخازن اسناد',
                //     type: 'item',
                //     url: '/document-stores',
                //     icon: icons.IconFiles,
                //     breadcrumbs: true,
                //     permission: 'documentStores:view'
                // }
            ]
        },
        {
            id: 'evaluations',
            title: 'ارزیابی‌ها',
            type: 'group',
            children: [
                {
                    id: 'datasets',
                    title: 'مجموعه داده‌ها',
                    type: 'item',
                    url: '/datasets',
                    icon: icons.IconDatabase,
                    breadcrumbs: true,
                    display: 'feat:datasets',
                    permission: 'datasets:view'
                },
                {
                    id: 'evaluators',
                    title: 'ارزیاب‌ها',
                    type: 'item',
                    url: '/evaluators',
                    icon: icons.IconTestPipe,
                    breadcrumbs: true,
                    display: 'feat:evaluators',
                    permission: 'evaluators:view'
                },
                {
                    id: 'evaluations',
                    title: 'ارزیابی‌ها',
                    type: 'item',
                    url: '/evaluations',
                    icon: icons.IconChartHistogram,
                    breadcrumbs: true,
                    display: 'feat:evaluations',
                    permission: 'evaluations:view'
                }
            ]
        },
        {
            id: 'management',
            title: 'مدیریت کاربران و فضای کاری',
            type: 'group',
            children: [
                {
                    id: 'sso',
                    title: 'پیکربندی SSO',
                    type: 'item',
                    url: '/sso-config',
                    icon: icons.IconShieldLock,
                    breadcrumbs: true,
                    display: 'feat:sso-config',
                    permission: 'sso:manage'
                },
                {
                    id: 'roles',
                    title: 'نقش‌ها',
                    type: 'item',
                    url: '/roles',
                    icon: icons.IconLockCheck,
                    breadcrumbs: true,
                    display: 'feat:roles',
                    permission: 'roles:manage'
                },
                {
                    id: 'users',
                    title: 'کاربران',
                    type: 'item',
                    url: '/users',
                    icon: icons.IconUsers,
                    breadcrumbs: true,
                    display: 'feat:users',
                    permission: 'users:manage'
                },
                {
                    id: 'workspaces',
                    title: 'فضاهای کاری',
                    type: 'item',
                    url: '/workspaces',
                    icon: icons.IconStack2,
                    breadcrumbs: true,
                    display: 'feat:workspaces',
                    permission: 'workspace:view'
                },
                {
                    id: 'login-activity',
                    title: 'فعالیت ورود',
                    type: 'item',
                    url: '/login-activity',
                    icon: icons.IconClipboardList,
                    breadcrumbs: true,
                    display: 'feat:login-activity',
                    permission: 'loginActivity:view'
                }
            ]
        },
        {
            id: 'others',
            title: 'سایر',
            type: 'group',
            children: [
                {
                    id: 'logs',
                    title: 'گزارش‌ها',
                    type: 'item',
                    url: '/logs',
                    icon: icons.IconList,
                    breadcrumbs: true,
                    display: 'feat:logs',
                    permission: 'logs:view'
                },
                // {
                //     id: 'files',
                //     title: 'Files',
                //     type: 'item',
                //     url: '/files',
                //     icon: icons.IconFileDatabase,
                //     breadcrumbs: true,
                //     display: 'feat:files',
                // },
                {
                    id: 'account',
                    title: 'تنظیمات حساب',
                    type: 'item',
                    url: '/account',
                    icon: icons.IconSettings,
                    breadcrumbs: true,
                    display: 'feat:account'
                }
            ]
        }
    ]
}

export default dashboard
