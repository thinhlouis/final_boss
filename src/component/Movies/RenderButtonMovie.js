const details = [
  {
    id: "1",
    slug: "phim-moi-cap-nhat-v3",
    name: "mới cập nhật",
  },
  {
    id: "2",
    slug: "phim-bo",
    name: "phim bộ",
  },
  {
    id: "3",
    slug: "phim-le",
    name: "phim lẻ",
  },
  {
    id: "4",
    slug: "hoat-hinh",
    name: "hoạt hình",
  },
  {
    id: "5",
    slug: "tv-shows",
    name: "tv shows",
  },
];

export default function RenderButtonMovie({ onClick }) {
  return (
    <nav className="nav-movie">
      <ul className="root_flex_row">
        {details.map((item) => (
          <li key={item.id}>
            <button onClick={() => onClick(item.slug, item.name)}>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
