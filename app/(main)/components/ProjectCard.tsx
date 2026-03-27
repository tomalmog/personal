import { ExternalLink } from 'lucide-react';

interface ProjectLink {
  label: string;
  url: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  links?: ProjectLink[];
  link?: string;
}

export default function ProjectCard({ title, description, tags, links, link }: ProjectCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-medium text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          {links && links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {links.map((linkItem, index) => (
                <a
                  key={index}
                  href={linkItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ExternalLink size={14} />
                  {linkItem.label}
                </a>
              ))}
            </div>
          )}

          {link && !links && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ExternalLink size={14} />
              View Project
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
