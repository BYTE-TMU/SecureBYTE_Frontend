import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Item, ItemMedia, ItemTitle } from '@/components/ui/item';
import { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectValue,
} from '@/components/ui/select';

const languages = [
  {
    name: 'Python',
    logo: 'PY',
  },
  {
    name: 'Javascript',
    logo: 'JS',
  },
  {
    name: 'Typescript',
    logo: 'TS',
    style: 'fill-black-300',
  },
  {
    name: 'Java',
    logo: 'JV',
  },
  {
    name: 'SQL',
    logo: 'SQL',
  },
  {
    name: 'C',
    logo: 'C',
  },
  {
    name: 'C++',
    logo: 'C++',
  },
  {
    name: 'C#',
    logo: 'C#',
  },
];
export function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  return (
    <Select>
      <SelectTrigger className="w-full px-2 py-7">
        <SelectValue
          placeholder={
            selectedLanguage ? selectedLanguage : 'Select A Language'
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Languages</SelectLabel>
          {languages.map((language) => (
            <SelectItem value={language.name}>
              <Item size="sm" className="w-full p-1">
                <ItemMedia>
                  <Avatar className="size-8">
                    {/* <AvatarImage
                      src={language.logo}
                      className={language.style}
                    /> */}
                    <AvatarFallback className="bg-secure-blue text-white font-semibold">
                      {language.logo}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>

                <ItemTitle>{language.name}</ItemTitle>
              </Item>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
