export const buildUrl = (...paths: (string | undefined)[]) =>
    '/' + paths.filter(Boolean).join('/');

export const urlBuilder = ({
    product,
    issue,
    front,
    article,
}: {
    product: string;
    issue?: string;
    front?: string;
    article?: string;
}) => buildUrl(product, issue, front, article);
