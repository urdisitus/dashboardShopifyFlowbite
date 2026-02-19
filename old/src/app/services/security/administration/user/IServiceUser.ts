import { FilterPageParam } from "src/app/models/generic/FilterPageParam";
import { ResultPage } from "src/app/models/generic/Impl/ResultPage";
import { UsuarioListado } from "src/app/models/security/administration/user/UsuarioListado";

interface IServiceUser {
    filter(param: FilterPageParam<string>): Promise<ResultPage<UsuarioListado>>;
}