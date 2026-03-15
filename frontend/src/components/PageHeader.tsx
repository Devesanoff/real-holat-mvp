interface Props {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-6">
      <h1 className="font-serif text-3xl sm:text-4xl text-slate-900">
        {title}
      </h1>
      {subtitle && (
        <p className="text-slate-500 mt-2 text-sm sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
