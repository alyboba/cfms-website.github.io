import SitemapController from '../controllers/sitemap';

export default function SiteMap(ctx, next) {
	new SitemapController();
	next();
}