export default function SkillsGrid({ skills }) {
  return (
    <div className="skills">
      {skills.map((group) => (
        <div className="skill-col" key={group.title}>
          <h4>{group.title}</h4>
          <ul>
            {group.items.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
