import { Button } from "../button/Button";
import { FormField } from "../formField/FormField";
import { IconButton } from "../iconButton/IconButton";
import { Input } from "../input/Input";
import { Label } from "../label/Label";
import { Link } from "../link/Link";
import { Textarea } from "../textarea/Textarea";
import { registerComponent } from "./lib/registerComponent";

registerComponent(Button);
registerComponent(IconButton);
registerComponent(Input);
registerComponent(Label);
registerComponent(Link);
registerComponent(FormField);
registerComponent(Textarea);
