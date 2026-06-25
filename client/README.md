```md
src/
├── main.tsx
├── App.tsx
├── index.css
│
├── api/
│   ├── client.ts
│   ├── interceptors.ts
│   ├── auth.api.ts
│   ├── files.api.ts
│   └── users.api.ts
│
├── routes/
│   ├── routes.tsx
│   ├── route-tree.ts
│   └── router.ts
│
├── store/
│   ├── auth-store.ts
│   ├── ui-store.ts
│   └── theme-store.ts
│
├── hooks/
│   ├── use-login.ts
│   ├── use-register.ts
│   ├── use-logout.ts
│   ├── use-me.ts
│   ├── use-files.ts
│   ├── use-file.ts
│   ├── use-upload-file.ts
│   ├── use-delete-file.ts
│   └── use-update-profile.ts
│
├── pages/
│   ├── auth/
│   │   ├── login-page.tsx
│   │   ├── register-page.tsx
│   │   └── forgot-password-page.tsx
│   │
│   ├── dashboard/
│   │   └── dashboard-page.tsx
│   │
│   ├── files/
│   │   ├── files-page.tsx
│   │   └── file-details-page.tsx
│   │
│   ├── profile/
│   │   └── profile-page.tsx
│   │
│   └── settings/
│       └── settings-page.tsx
│
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── spinner.tsx
│   │
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   └── dashboard-layout.tsx
│   │
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── forgot-password-form.tsx
│   │
│   └── files/
│       ├── file-list.tsx
│       ├── file-card.tsx
│       ├── upload-dialog.tsx
│       └── file-actions.tsx
│
├── lib/
│   ├── constants.ts
│   ├── query-client.ts
│   ├── query-keys.ts
│   ├── utils.ts
│   └── storage.ts
│
├── types/
│   ├── auth.ts
│   ├── file.ts
│   ├── user.ts
│   ├── api.ts
│   └── common.ts
│
├── assets/
│   ├── images/
│   └── icons/
│
└── vite-env.d.ts
```

